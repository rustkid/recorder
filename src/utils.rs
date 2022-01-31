#![allow(non_snake_case)]

use gloo::{console, utils};
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::JsFuture;

use web_sys::{AudioContext, DisplayMediaStreamConstraints, MediaStream, MediaStreamConstraints};

pub fn AudioVideoMix(audio_stream: &MediaStream, video_stream: &MediaStream) -> MediaStream {
    let ctx = AudioContext::new().unwrap();
    let dest = ctx.create_media_stream_destination().unwrap();

    if audio_stream.get_audio_tracks().iter().len() > 0
        && video_stream.get_video_tracks().iter().len() > 0
    {
        let source = ctx.create_media_stream_source(&audio_stream).unwrap();
        source.connect_with_audio_node(&dest).unwrap();
    }

    let tracks = dest.stream().get_tracks();
    let vtracks = video_stream.get_video_tracks();
    let tracks = tracks.concat(&vtracks);
    return MediaStream::new_with_tracks(&tracks).unwrap();
}

pub struct AV {
    pub audio: bool,
    pub video: bool,
}

pub async fn cam_stream(av: AV) -> Result<MediaStream, JsValue> {
    let md = utils::window().navigator().media_devices().unwrap();
    let mut constraints = MediaStreamConstraints::new();
    constraints.video(&JsValue::from(av.video));
    constraints.audio(&JsValue::from(av.audio));
    let gum = md.get_user_media_with_constraints(&constraints).unwrap();
    console::log!("Waiting for permission");
    JsFuture::from(gum).await.map(MediaStream::from)
}

pub async fn display_stream(av: AV) -> Result<MediaStream, JsValue> {
    let md = utils::window().navigator().media_devices().unwrap();
    let mut constraints = DisplayMediaStreamConstraints::new();
    constraints.video(&JsValue::from(av.video));
    constraints.audio(&JsValue::from(av.audio));
    let gum = md.get_display_media_with_constraints(&constraints).unwrap();
    console::log!("Waiting for permission");
    JsFuture::from(gum).await.map(MediaStream::from)
}

#[allow(dead_code)]
#[derive(Debug, Clone, Copy)]
pub enum Action {
    Start,
    Stop,
    Pause,
    Resume,
    Idle,
    Play,
    Save,
}
