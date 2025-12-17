module ServerInfo exposing
    ( ServerInfo
    , decoder
    )

import Json.Decode as D


type alias ServerInfo =
    { timezoneOffset : Int
    }


decoder : D.Decoder ServerInfo
decoder =
    D.map ServerInfo
        (D.field "timezoneOffset" D.int)
