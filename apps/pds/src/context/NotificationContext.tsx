import { NotificationActions } from "@ericsison-dev/my-ui";
import { createContext } from "react";

type NotifContextState = {
    notify: NotificationActions;
}

export const NotificationContext = createContext({} as NotifContextState)