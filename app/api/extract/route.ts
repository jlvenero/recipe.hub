import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
// Adicionamos o ResponseSchema aqui na importação
import { GoogleGenerativeAI, SchemaType, ResponseSchema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ==========================================
// SCHEMA DE RESPOSTA (STRUCTURED OUTPUTS)
// Tipado explicitamente com 'ResponseSchema' para remover os erros do TypeScript
// ==========================================
const recipeResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING, description: "O nome formal da receita." },
    description: { type: SchemaType.STRING, description: "Uma descrição curta e apetitosa do prato (1-2 frases)." },
    prepTime: { type: SchemaType.STRING, description: "Tempo de preparo estimado (ex: '45 min')." },
    ingredients: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "A lista de ingredientes exatos com as quantidades." 
    },
    instructions: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "O passo a passo do modo de preparo detalhado." 
    }
  },
  required: ["name", "description", "prepTime", "ingredients", "instructions"]
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, query } = body;

    if (!url && !query) {
      return NextResponse.json({ error: "URL ou termo de busca são obrigatórios." }, { status: 400 });
    }

    let recipeData = null;

    // Configuração do modelo com o Schema rigoroso
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: recipeResponseSchema
      }
    });

    // ---------------------------------------------------------
    // ROTA: GERAR RECEITA VIA IA (Termo de busca)
    // ---------------------------------------------------------
    if (query) {
      if (!process.env.GEMINI_API_KEY) throw new Error("A chave do Gemini não foi configurada.");

      const prompt = `Você é um chef expert e assistente culinário. O usuário pediu uma receita para: "${query}". Encontre a receita mais clássica, deliciosa e bem avaliada para este pedido.`;
      
      const result = await model.generateContent(prompt);
      const aiRecipe = JSON.parse(result.response.text());

      return NextResponse.json({
        ...aiRecipe,
        image: null,
        method: "Gemini AI (Generation)"
      });
    }

    // ---------------------------------------------------------
    // ROTA: EXTRAÇÃO DE URL
    // ---------------------------------------------------------
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    });

    if (!response.ok) throw new Error(`Erro de acesso ao site (${response.status}).`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // PLANO A: JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        const items = Array.isArray(json) ? json : json['@graph'] ? json['@graph'] : [json];

        for (const item of items) {
          const isRecipe = item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'));
          
          if (isRecipe) {
            recipeData = {
              name: item.name,
              ingredients: item.recipeIngredient || [],
              instructions: item.recipeInstructions?.map((step: any) => step.text || step) || [],
              image: item.image?.url || (Array.isArray(item.image) ? item.image[0] : item.image) || null,
              prepTime: item.totalTime || item.prepTime || "45 min",
              method: "JSON-LD (Fast)"
            };
            break; // Para o loop ao encontrar
          }
        }
      } catch (e) { } // Ignora erros de parse no loop
    });

    // PLANO B: Gemini Fallback
    if (!recipeData) {
      if (!process.env.GEMINI_API_KEY) throw new Error("JSON-LD não encontrado e chave da IA ausente.");

      $('script, style, nav, footer, header, aside, iframe, noscript').remove();
      const cleanText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000);
      const title = $('title').text().trim();
      const ogImage = $('meta[property="og:image"]').attr('content') || null;

      const prompt = `Analise o texto retirado do site '${title}' e extraia a receita. Texto: ${cleanText}`;
      const result = await model.generateContent(prompt);
      
      const aiRecipe = JSON.parse(result.response.text());

      recipeData = {
        ...aiRecipe,
        image: ogImage,
        method: "Gemini AI (Smart Fallback)"
      };
    }

    return NextResponse.json(recipeData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Falha na extração." }, { status: 500 });
  }
}