type StateProps = {
  identifier: string | null;
};

const useNotificationStore = defineStore("notification-store", {
  state: () =>
    <StateProps>{
      identifier: "notify",
    },
  persist: true,
  getters: {},
  actions: {
    setNotification(config: any) {},
    show() {},
  },
});

export default useNotificationStore;
