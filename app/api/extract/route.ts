import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, query } = body;

    // Se não tiver nem url nem query, bloqueia.
    if (!url && !query) {
      return NextResponse.json({ error: "URL ou termo de busca são obrigatórios." }, { status: 400 });
    }

    let recipeData = null;

    // ---------------------------------------------------------
    // NOVA ROTA: GERAR RECEITA VIA IA (Quando o usuário digita o prato)
    // ---------------------------------------------------------
    if (query) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("A chave do Gemini não foi configurada.");
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        Você é um chef expert e assistente culinário. 
        O usuário pediu uma receita para: "${query}".
        Encontre em sua base de conhecimento a receita mais clássica, deliciosa e bem avaliada para este pedido.
        Retorne ESTRITAMENTE um objeto JSON com as seguintes chaves:
        - "name": (string) O nome formal da receita.
        - "description": (string) Uma descrição curta e apetitosa do prato (1-2 frases).
        - "prepTime": (string) Tempo de preparo estimado (ex: "45 min").
        - "ingredients": (array de strings) A lista de ingredientes exatos com as quantidades.
        - "instructions": (array de strings) O passo a passo do modo de preparo detalhado, de forma clara e limpa.
      `;

      const result = await model.generateContent(prompt);
      let aiResponseText = result.response.text();
      aiResponseText = aiResponseText.replace(/^```json/g, "").replace(/```$/g, "").trim();
      
      let aiRecipe;
      try {
        aiRecipe = JSON.parse(aiResponseText);
      } catch (parseError) {
        throw new Error("A IA não conseguiu formatar a receita corretamente. Tente novamente.");
      }

      return NextResponse.json({
        name: aiRecipe.name || query,
        description: aiRecipe.description || "Receita gerada especialmente para você por inteligência artificial.",
        ingredients: aiRecipe.ingredients || [],
        instructions: aiRecipe.instructions || [],
        prepTime: aiRecipe.prepTime || "40 min",
        image: null, // Como a IA de texto não gera imagem, ficará com o fallback de "Sem Imagem" no FrontEnd
        method: "Gemini AI (Generation)"
      });
    }

    // ---------------------------------------------------------
    // ROTA EXISTENTE: EXTRAÇÃO DE URL (Plano A e B)
    // ---------------------------------------------------------
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    });

    if (!response.ok) {
      throw new Error(`Erro de acesso ao site (${response.status}).`);
    }

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
            break;
          }
        }
      } catch (e) { }
    });

    // PLANO B: Gemini Fallback
    if (!recipeData) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("JSON-LD não encontrado e chave da IA ausente.");
      }

      $('script, style, nav, footer, header, aside, iframe, noscript').remove();
      const cleanText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000);
      const title = $('title').text().trim();
      const ogImage = $('meta[property="og:image"]').attr('content') || null;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        Analise o texto retirado do site '${title}' e extraia a receita.
        Retorne ESTRITAMENTE um objeto JSON com: "name", "ingredients" (array), "instructions" (array) e "prepTime" (string).
        Texto: ${cleanText}
      `;

      const result = await model.generateContent(prompt);
      let aiResponseText = result.response.text();
      aiResponseText = aiResponseText.replace(/^```json/g, "").replace(/```$/g, "").trim();
      
      const aiRecipe = JSON.parse(aiResponseText);

      recipeData = {
        name: aiRecipe.name || title,
        ingredients: aiRecipe.ingredients || [],
        instructions: aiRecipe.instructions || [],
        prepTime: aiRecipe.prepTime || "60 min",
        image: ogImage,
        method: "Gemini AI (Smart Fallback)"
      };
    }

    return NextResponse.json(recipeData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Falha na extração." }, { status: 500 });
  }
}