import useNotificationStore from "~/stores/notification.store";

/**
 * Notifie le frontend en passant par le store (notificationStore)
 * @param message
 * @param color
 * @param config
 */
export const notify = (options : any,color : string ='default' ,config : any = {}) => {
    const useNotification = useNotificationStore();

    if(typeof options === 'string'){
        config.message = options;
        config.color = color;
    }
    if(typeof options === 'object'){
       config = {...options} ;
    }

    useNotification.setNotification(config);

    return  useNotification.show();
};