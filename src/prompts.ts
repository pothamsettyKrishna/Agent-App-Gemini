export function createImgPrompt(story: string): string {
    return `Create picture of ${String(story)}. It should be in an photo-realistic style.
        Do not include any words or modals in the image.`;
}

export function createOptionsPrompt(): string {
    return `Give me five random options to create images using 'imagen3Fast' model with below instructions.

          INSTRUCTIONS:
          1. Option should be of one or two words
          2. Option should be children friendly
          3. Final responses should be structured as follows:

              {
                    options: [ // options to answer agentResponse if it is a question
                      "option_1",
                      "option_2",
                      "option_3",
                      ...
                    ]
              }`
          ;
}

export function createProductDescPrompt(name: string, desc: string, target: string, tone:string){
    return `
        Write a brief product description for the following product:

        Product Name: ${name}
        Key Features: ${desc}
        Target Audience: ${target}
        Tone: ${tone}

        Final responses should be structured as follows:
        {
            options: [ // options to answer agentResponse if it is a question
                "description_1",
                "description_2"
                ...
            ]
        }
    `
}

export function getCaptionPrompt(){
    return `I want to share this image in socal media. So, Write a caption for this image.
    
    Final responses should be structured as follows:
        {
            options: [ // options to answer agentResponse if it is a question
                "caption_1",
                "caption_2"
                ...
            ]
        }
            `
}