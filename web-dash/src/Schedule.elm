module Schedule exposing
    ( Item
    , encodeItem
    , encodeSchedule
    , itemDecoder
    , scheduleDecoder
    )

import Json.Decode as D
import Json.Encode as E
import Time


type alias Item =
    { scriptName : String
    , activation : Activation
    }


type Activation
    = TickActivation Int
    | TimeActivation Time.Posix


encodeItem : Item -> E.Value
encodeItem { scriptName, activation } =
    let
        activationField =
            case activation of
                TickActivation tick ->
                    E.object
                        [ ( "type", E.string "tick" )
                        , ( "tick", E.int tick )
                        ]

                TimeActivation time ->
                    E.object
                        [ ( "type", E.string "time" )
                        , ( "time", E.int <| Time.posixToMillis time )
                        ]
    in
    E.object
        [ ( "scriptName", E.string scriptName )
        , ( "activation", activationField )
        ]


encodeSchedule : List Item -> E.Value
encodeSchedule schedule =
    E.list encodeItem schedule


itemDecoder : D.Decoder Item
itemDecoder =
    D.map2 Item
        (D.field "scriptName" D.string)
        (D.field "activation" activationDecoder)


activationDecoder : D.Decoder Activation
activationDecoder =
    D.oneOf [ tickActivationDecoder, timeActivationDecoder ]


tickActivationDecoder : D.Decoder Activation
tickActivationDecoder =
    D.map2 (\_ -> TickActivation)
        (D.field "type" (exactStringDecoder "tick"))
        (D.field "tick" D.int)


timeActivationDecoder : D.Decoder Activation
timeActivationDecoder =
    D.map2 (\_ -> \time -> time |> Time.millisToPosix |> TimeActivation)
        (D.field "type" (exactStringDecoder "time"))
        (D.field "time" D.int)


exactStringDecoder : String -> D.Decoder String
exactStringDecoder expect =
    D.string
        |> D.andThen
            (\string ->
                if expect == string then
                    D.succeed string

                else
                    D.fail "Expected exact string match"
            )


scheduleDecoder : D.Decoder (List Item)
scheduleDecoder =
    D.list itemDecoder
