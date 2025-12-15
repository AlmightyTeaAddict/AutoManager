module Styles exposing
    ( bodyFont
    , button
    , darkColour
    , headingFont
    , lightColour
    )

import Css


bodyFont : Css.Style
bodyFont =
    Css.fontFamilies [ "Noto Sans", "Tahoma", "sans-serif" ]


headingFont : Css.Style
headingFont =
    Css.fontFamilies [ "Cascadia code", "Courier New", "monospace" ]


darkColour : Css.Color
darkColour =
    Css.rgb 6 10 14


lightColour : Css.Color
lightColour =
    Css.rgb 255 255 255


button : List Css.Style
button =
    [ Css.color darkColour
    , Css.borderColor darkColour
    , Css.borderWidth (Css.px 2)
    , Css.backgroundColor lightColour
    , Css.cursor Css.pointer
    , Css.padding (Css.rem 0.5)
    , bodyFont
    , Css.fontSize (Css.rem 1)
    ]
