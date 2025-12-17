module Api exposing
    ( getSchedule
    , getServerInfo
    , url
    )

import Http
import Schedule
import ServerInfo exposing (ServerInfo)


url : String
url =
    "http://localhost:8080"


getSchedule : (Result Http.Error (List Schedule.Item) -> msg) -> Cmd msg
getSchedule toMsg =
    Http.get
        { url = url ++ "/api/schedule"
        , expect = Http.expectJson toMsg Schedule.scheduleDecoder
        }


getServerInfo : (Result Http.Error ServerInfo -> msg) -> Cmd msg
getServerInfo toMsg =
    Http.get
        { url = url ++ "/api/server-info"
        , expect = Http.expectJson toMsg ServerInfo.decoder
        }
