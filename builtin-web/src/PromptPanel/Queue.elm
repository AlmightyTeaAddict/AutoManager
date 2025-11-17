module PromptPanel.Queue exposing
    ( Item
    , decoder
    , encode
    , encodeItem
    , itemDecoder
    )

import Json.Decode as D
import Json.Encode as E


type alias Item =
    { name : String
    , id : Int
    }


encodeItem : Item -> E.Value
encodeItem { name, id } =
    E.object
        [ ( "name", E.string name )
        , ( "id", E.int id )
        ]


encode : List Item -> E.Value
encode queue =
    E.list encodeItem queue


itemDecoder : D.Decoder Item
itemDecoder =
    D.map2 Item
        (D.field "name" D.string)
        (D.field "id" D.int)


decoder : D.Decoder (List Item)
decoder =
    D.list itemDecoder
