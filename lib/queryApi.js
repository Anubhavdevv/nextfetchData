import openai from "./chatgpt";

const query = async(prompt,model)=>{
    const response = await openai.createCompletion({
        model,
        prompt,
        temperature: 0.9,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }).then(res => res.data.choices[0].text).catch((err)=>`chatgpt was unable to find answr for that: ${err.message})`);

    return response;
}

export default query;