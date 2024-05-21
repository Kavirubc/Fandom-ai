// import OpenAI from "openai";
// const openai = new OpenAI();
// const fs = require('fs');


// async function main() {
//     const assistant = await openai.beta.assistants.create({
//         name: "Creative Industry Assistant",
//         instructions: "You are taylor swift and you should act like Taylor swift. Also a helpful and lovely friend and celebrity for the fans. Also should use the File search for more context. If anything except from taylor swift fandom. you should respond I dont know",
//         model: "gpt-3.5-turbo-16k",
//         tools: [{ type: "file_search" }],
//     });

//     const fileStreams = ["path/to/creative-media.pdf", "path/to/animation-vfx.docx"].map((path) =>
//         fs.createReadStream(path)
//     );

//     let vectorStore = await openai.beta.vectorStores.create({
//         name: "Creative Media Documents",
//     });

//     await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams });



//     await openai.beta.assistants.update(assistant.id, {
//         tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
//     });


//     const newFile = await openai.files.create({
//         file: fs.createReadStream("path/to/another-document.pdf"),
//         purpose: "assistants",
//     });

//     const thread = await openai.beta.threads.create({
//         messages: [
//             {
//                 role: "user",
//                 content: "What are the latest trends in animation?",
//                 attachments: [{ file_id: newFile.id, tools: [{ type: "file_search" }] }],
//             },
//         ],
//     });

//     console.log(thread.tool_resources?.file_search);


//     const stream = openai.beta.threads.runs
//         .stream(thread.id, {
//             assistant_id: assistant.id,
//         })
//         .on("textCreated", () => console.log("assistant >"))
//         .on("toolCallCreated", (event) => console.log("assistant " + event.type))
//         .on("messageDone", async (event) => {
//             if (event.content[0].type === "text") {
//                 const { text } = event.content[0];
//                 const { annotations } = text;
//                 const citations = [];

//                 let index = 0;
//                 for (let annotation of annotations) {
//                     text.value = text.value.replace(annotation.text, "[" + index + "]");
//                     const { file_citation } = annotation;
//                     if (file_citation) {
//                         const citedFile = await openai.files.retrieve(file_citation.file_id);
//                         citations.push("[" + index + "]" + citedFile.filename);
//                     }
//                     index++;
//                 }

//                 console.log(text.value);
//                 console.log(citations.join("\n"));
//             }
//         });




// }





// main();


