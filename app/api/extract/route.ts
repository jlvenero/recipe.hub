import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "A URL é obrigatória." }, { status: 400 });
    }

    // 1. Baixamos o HTML disfarçados de navegador
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    });

    if (!response.ok) {
      throw new Error(`Erro de acesso ao site (${response.status}).`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    let recipeData = null;

    // ---------------------------------------------------------
    // PLANO A: Extração Rápida via JSON-LD (Caminho Feliz)
    // ---------------------------------------------------------
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
              method: "JSON-LD (Fast)"
            };
            break;
          }
        }
      } catch (e) {
        // Ignora falhas no JSON estruturado e segue
      }
    });

    // ---------------------------------------------------------
    // PLANO B: Extração Inteligente com IA (Gemini Fallback)
    // ---------------------------------------------------------
    if (!recipeData) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("JSON-LD não encontrado e a chave do Gemini não foi configurada para o fallback.");
      }

      // Limpamos o HTML tirando tags inúteis para facilitar para a IA
      $('script, style, nav, footer, header, aside, iframe, noscript').remove();
      
      // Pegamos apenas o texto da página, removemos espaços extras e limitamos o tamanho
      const cleanText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000);
      const title = $('title').text().trim();
      const ogImage = $('meta[property="og:image"]').attr('content') || null;

      // Configuramos o modelo para forçar a saída em JSON
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        Você é um assistente culinário extrator de dados. 
        Analise o texto abaixo retirado do site '${title}' e extraia a receita.
        Retorne ESTRITAMENTE um objeto JSON com as seguintes chaves:
        - "name": (string) O nome da receita.
        - "ingredients": (array de strings) A lista de ingredientes com as quantidades.
        - "instructions": (array de strings) O passo a passo do modo de preparo.
        Se o texto não contiver uma receita, retorne arrays vazias.

        Texto da página:
        ${cleanText}
      `;

      const result = await model.generateContent(prompt);
      let aiResponseText = result.response.text();
      
      // Limpa possíveis formatações markdown que a IA pode ter inserido por acidente
      aiResponseText = aiResponseText.replace(/^```json/g, "").replace(/```$/g, "").trim();
      
      let aiRecipe;
      try {
        aiRecipe = JSON.parse(aiResponseText);
      } catch (parseError) {
        throw new Error("A IA não conseguiu formatar a receita corretamente desta vez. Tente importar novamente.");
      }

      recipeData = {
        name: aiRecipe.name || title,
        ingredients: aiRecipe.ingredients || [],
        instructions: aiRecipe.instructions || [],
        image: ogImage, // Pegamos a imagem da meta tag como quebra-galho
        method: "Gemini AI (Smart Fallback)"
      };
    }

    return NextResponse.json(recipeData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Falha na extração." }, { status: 500 });
  }
}