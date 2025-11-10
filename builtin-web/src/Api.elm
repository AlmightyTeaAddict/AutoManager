module Api exposing
    ( getPromptQueue
    , getSchedule
    )

import Http
import PromptQueue
import Schedule


apiUrl : String
apiUrl =
    "http://localhost:8080"


getPromptQueue : (Result Http.Error (List PromptQueue.Item) -> msg) -> Cmd msg
getPromptQueue toMsg =
    Http.get
        { url = apiUrl ++ "/api/prompt"
        , expect = Http.expectJson toMsg PromptQueue.queueDecoder
        }


getSchedule : (Result Http.Error (List Schedule.Item) -> msg) -> Cmd msg
getSchedule toMsg =
    Http.get
        { url = apiUrl ++ "/api/schedule"
        , expect = Http.expectJson toMsg Schedule.scheduleDecoder
        }
