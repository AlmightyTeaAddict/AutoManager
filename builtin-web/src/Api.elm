module Api exposing (getPromptQueue)

import Http
import PromptQueue

apiUrl : String
apiUrl = "http://localhost:8080"

getPromptQueue : ((Result Http.Error (List PromptQueue.Item)) -> msg) -> Cmd msg
getPromptQueue toMsg =
        Http.get
                { url = apiUrl ++ "/api/prompt"
                , expect = Http.expectJson toMsg PromptQueue.queueDecoder
                }
