const axios = require('axios');
const split2 = require('split2'); // Used to split streams based on line breaks


// Call the streaming POST interface
async function callStreamingPost() {
    const startTime = Date.now(); // start time
    const ttsUrl = 'https://api.minimax.chat/v1/t2a_v2?GroupId=xxx';
    const ttsHeaders = buildTtsStreamHeaders();
    const ttsBody = buildTtsStreamBody('As the population of the Internet grows rapidly the development of web technologies becomes extremely important', 'cartoon-boy-07', 1.0, '');
    try {
        await axios({
            method: 'post',
            url: ttsUrl,
            data: ttsBody,
            responseType: 'stream',
            headers: ttsHeaders,
        }).then(response => {
            response.data.pipe(split2()).on('data', async (line) => {
                try {
                    const parsed = JSON.parse(line); // parse the JSON
                    console.log('Received line:', parsed);
                    // }
                } catch (err) {
                    console.error('Failed to parse line:', line);
                }
            });
            response.data.on('end', async () => {
                const endTime = Date.now(); // end time
                const totalTime = (endTime - startTime) / 1000; // total time
                console.log('Total time:', totalTime, 'seconds');
                console.log('Stream ended.');
            })
        });
    } catch (error) {
        console.error('Error calling streaming POST API:', error.message);
    }

}

function buildTtsStreamHeaders() {
    return {
        'content-type': 'application/json',
        authorization: `Bearer TOKEN`,
    };
}

function buildTtsStreamBody(text, voice_id, speed, language_boost) {
    return JSON.stringify({
        model: 'speech-01-turbo',
        text,
        stream: true,
        voice_setting: {
            voice_id,
            speed: +speed ?? 1.0,
            vol: 1.0,
            pitch: 0,
        },
        audio_setting: {
            sample_rate: 32000,
            format: 'pcm',
            channel: 1,
        },
    });
}



// Call the streaming POST interface
callStreamingPost();







