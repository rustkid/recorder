#![allow(non_snake_case)]

use web_sys::{AudioContext, MediaStream};

pub fn AudioVideoMix(audio_stream: MediaStream, video_stream: MediaStream) -> MediaStream {
    let ctx = AudioContext::new().unwrap();
    let dest = ctx.create_media_stream_destination().unwrap();

    if audio_stream.get_audio_tracks().iter().len() > 0 {
        let source = ctx.create_media_stream_source(&audio_stream).unwrap();
        source.connect_with_audio_node(&dest).unwrap();
    }

    let tracks = dest.stream().get_tracks();
    let vtracks = video_stream.get_video_tracks();
    let tracks = tracks.concat(&vtracks);
    return MediaStream::new_with_tracks(&tracks).unwrap();
}
