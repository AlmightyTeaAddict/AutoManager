module PromptPanel.Api exposing (getQueue)

import Api
import Http
import PromptPanel.Queue


getQueue : (Result Http.Error (List PromptPanel.Queue.Item) -> msg) -> Cmd msg
getQueue toMsg =
    Http.get
        { url = Api.url ++ "/api/prompt"
        , expect = Http.expectJson toMsg PromptPanel.Queue.decoder
        }
