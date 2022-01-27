#![allow(non_snake_case)]
use dioxus::prelude::*;
use dioxus::router::Link;

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
                        }
                    }
                }
        })
}

fn Article(cx: Scope) -> Element {
    let iconScreen = Icons(cx, Icon::Screen);
    let iconVideocam = Icons(cx, Icon::Videocam);
    cx.render(rsx! {
        article {style:"align-content:start; place-content: center;",
                    header{
                        h2{"Record"}
                    }
                    section{
                        Link {to:"/screen/",
                            button{
                                div{ style:"gap:0; place-items:center;",
                                    span{&iconScreen}
                                    span{"Screen"}
                                }
                            }
                        }
                        Link { to:"/cam/",
                            button{
                                div{ style:"gap:0; place-items:center;",
                                span{&iconVideocam}
                                    span{"Camera"}
                                }
                            }
                        }
                    },
                }
    })
}
