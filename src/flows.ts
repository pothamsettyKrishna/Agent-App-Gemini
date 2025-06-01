import { Chat, genkit, Session } from 'genkit/beta';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';
import { imagen3Fast, vertexAI } from '@genkit-ai/vertexai';
import { parse } from 'partial-json';
import { optional, string, z } from 'zod';
import { format } from 'path';
import { response } from 'express';
import {createImgPrompt, createOptionsPrompt, createProductDescPrompt, getCaptionPrompt} from './prompts'
import { features } from 'process';
import { readFile } from 'fs/promises';

const model = gemini20Flash;

const ai = genkit({
  plugins: [googleAI(), vertexAI({ location: 'us-central1' })],
  model
});

let session: Session;

export const genImgFlow = ai.defineFlow(
  {
    name: 'genImgFlow',
    inputSchema: z.string(),
    outputSchema: z.string()
  },
  async (userInput) => {
    return await imgBlobFlow(createImgPrompt(userInput));
  }
);


export const imgBlobFlow = ai.defineFlow(
  {
    name:'imgBlobFlow',
    inputSchema: z.string(),
    outputSchema: z.string()
  },
  async (prompt) => {
    try {
      const response = await ai.generate({
        model: imagen3Fast,
        prompt,
        output: {format: 'media'},
      });
      return response.message!.content[0].media!.url;
    } catch(e){
      console.log(e);
      return '';
    }
  }
);


export const optionGenFlow = ai.defineFlow(
  {
    name: 'optionGenFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
      options: z.optional(z.array(z.string()))
    })
  },
  async (userInput) => {
    return await optionGen(createOptionsPrompt());
  }
);

export const optionGen = ai.defineFlow(
  {
    name:'optionGen',
    inputSchema: z.string(),
    outputSchema: z.object({
      options: z.optional(z.array(z.string()))
    })
  },
  async (prompt) => {
    try {
      const response = await ai.generate({
        model: gemini20Flash,
        prompt,
        config: {
            temperature: 1,
            topP: 0.95
          },
      });
      const text = response.text;
      return parse(maybeStripMarkdown(text));
    } catch(e){
      console.log(e);
      return '';
    }
  }
);


export const contentGenFlow = ai.defineFlow(
  {
    name: 'contentGenFlow',
    inputSchema: z.string(),
    outputSchema: z.string()
  },
  
  async (userInput) => {
    if (userInput != ''){
      console.log('Calling API....')
      return await contentGen(summaryPrompt(userInput));
    }
    return ''
  }
);


export const contentGen = ai.defineFlow(
  {
    name:'contentGen',
    inputSchema: z.string(),
    outputSchema: z.string()
  },
  async (prompt) => {
    try {
      const response = await ai.generate({
        model: gemini20Flash,
        prompt
      });
      return response.text;
    } catch(e){
      console.log(e);
      return '';
    }
  }
);

export function summaryPrompt(data: string): string {
    return `Summarize the below content
    
    CONTENT:

    ${data}
    
    `
          ;
}

const markdownRegex = /^\s*(```json)?((.|\n)*?)(```)?\s*$/i;
function maybeStripMarkdown(withMarkdown: string) {
  const mdMatch = markdownRegex.exec(withMarkdown);
  if (!mdMatch) {
    return withMarkdown;
  }
  return mdMatch[2];
}


const productOut = z.object({
  name: z.string(),
  features: z.string(),
  target: z.string(),
  tone: z.string()
})

export const productDescGenFlow = ai.defineFlow(
  {
    name: 'productDescGenFlow',
    inputSchema: z.object({
      userInput: productOut
    }),
    outputSchema: z.object({
      options: z.optional(z.array(z.string()))
    })
  },
  
  async (userInput) => {
    var product = userInput.userInput
    if (product.name != ''){
      console.log('Calling product an API....')
      // return await productDescGen()
      return await productDescGen(createProductDescPrompt(product.name, product.features, 
        product.target, product.tone));
    }
    return {
      "options" : []
    }
  }
);


export const productDescGen = ai.defineFlow(
  {
    name:'contentGen',
    inputSchema: z.string(),
    outputSchema: z.object({
      options: z.array(z.string())
    })
  },
  async (prompt) => {
    try {
      const response = await ai.generate({
        model: gemini20Flash,
        prompt
      });
      const text = response.text;
      return parse(maybeStripMarkdown(text));
    } catch(e){
      console.log(e);
      return '';
    }
  }
);


export async function imageCaptionGenFlow(req:any) {
  const filename = req.file.filename;
  const fileBuffer = req.file.buffer;
  const base64String = fileBuffer.toString('base64');
  const result = await imageCaptionGen(base64String)
  return result
}


export async function imageCaptionGen(base64String:any) {
  const response = await ai.generate({
  prompt: [{ media: { url: `data:image/jpeg;base64,${base64String}` } }, { text: getCaptionPrompt() }],
});
  // console.log(response.text)
  const text = response.text;
  return parse(maybeStripMarkdown(text));
}


