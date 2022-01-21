#![allow(non_snake_case)]
use dioxus::prelude::*;

//use gloo::console::log;

use crate::icons::{Icon, Icons};

pub fn Home(cx: Scope) -> Element {
    cx.render({
        rsx! {
            div{style:"gap:0; height:100%;",
                Header{}
                Article{}
                footer{ style:"justify-content:center",
                    p{ style:"font-size: 0.9rem;", "* Please use latest chrome browser"}
                }
            }
        }
    })
}

fn Header(cx: Scope) -> Element {
    let iconHourglass = Icons(cx, Icon::Hourglass);
    cx.render(rsx!{
        header{ style:"align-content:start;",
                    nav{ style:"justify-content:space-between; align-items:center;",
                        ul{ style:"gap:1rem;font-size:2rem;",
                            li{
                                style:"width:1.5rem; height:3rem; padding-top:8px; color:hsl(270deg 100% 50%);",
                                span{&iconHourglass}
                            }
                            li{"PixelPeg"}
                        },
                        ul{
                            li{"Record"}
                            li{"Remote"}
                            li{"WhiteBoard"}
                            li{"AirDrop"}
                        }
                    }
                }
        })
}

fn Article(cx: Scope) -> Element {
    let iconScreen = Icons(cx, Icon::Screen);
    let iconVideocam = Icons(cx, Icon::Videocam);
    let iconMic = Icons(cx, Icon::Mic);
    cx.render(rsx! {
        article {style:"align-content:start; place-content: center;",
                    header{
                        h2{"Record"}
                    }
                    section{
                        a {href:"/screen/",
                            button{
                                div{ style:"gap:0; place-items:center;",
                                    span{&iconScreen}
                                    span{"Screen"}
                                }
                            }
                        }
                        a{ href:"/cam/",
                            button{
                                div{ style:"gap:0; place-items:center;",
                                span{&iconVideocam}
                                    span{"Camera"}
                                }
                            }
                        }
                        a{ href:"/screencam/",
                            button{
                                section{ style:"gap:0px; justify-content:center;",
                                    span{&iconScreen}
                                    span{ class:"screen-cam-icon"}
                                }
                                "Screen + Cam"
                            }
                        }
                        a{ href:"/audio/",
                            button{
                                div{ style:"gap:0; place-items:center;",
                                span{&iconMic}
                                    span{"Mic Only"}
                                }
                            }
                        }
                    },
                    footer{
                        label{
                            style:"cursor:pointer;",
                            input{
                                style:"cursor:pointer;",
                                r#type: "checkbox",
                                /* checked:{*is_with_audio}, */
                                /* onclick:{toggle_audio}, */
                            }
                            "Record with Audio"
                        }
                        p{"Resolution: waiting" }
                    }
                }
    })
}
