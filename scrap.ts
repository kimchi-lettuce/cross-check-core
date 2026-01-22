console.log('hi')
import TranscriptAPI from 'youtube-transcript-api'

const test = await TranscriptAPI.getTranscript('nO06uyY3JCU')
console.log(test)
