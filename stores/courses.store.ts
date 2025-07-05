import type { AxiosResponse } from "axios";
import type {
  CategoryType,
  CourseResponse,
  CoursesResponse,
} from "~/types/courses.type";
import { categoriesConstants } from "~/constants/courses.constant";
import type { Course, Domain } from "~/types/trainings.type";
import useCoursesService from "~/services/courses.service";
import { notify } from "~/helpers/notifications";

type StateProps = {
  name: string;
  active_training: number | null;
  category_list: CategoryType[];
  courses: Course[];
};

const service = useCoursesService();

const useCoursesStore = defineStore("courses-store", {
  state: () =>
    <StateProps>{
      name: "",
      active_training: null,
      category_list: [],
      courses: [],
    },
  persist: true,
  getters: {
    getCategories: (state) => state.category_list,
    getCourses: (state) => state.courses,
    getName: (state) => state.name,
  },
  actions: {
    setActiveTraining(active: number) {
      this.active_training = active;
    },

    setNameTraining(str: string) {
      this.name = str;
    },

    async getAllCategories(domains?: Domain[]) {
      console.log("domains-store =>", domains);
      if (domains?.length) {
        let tab: CategoryType[] = [];
        for (let i = 0; i < domains.length; i++) {
          let cat: CategoryType = {
            title: domains[i].name,
            value: domains[i].categorie,
            color: domains[i].color,
          };
          tab.push(cat);
        }
        this.category_list = [...tab];
      } else {
        //   return response;
        this.category_list = [...categoriesConstants];
      }
    },

    async getFormationCourses(id: number | string) {
      const response: AxiosResponse =
        service.getFormationCourses && (await service.getFormationCourses(id));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as CoursesResponse;
        console.log("data-courses =>", data);
        this.courses = data.data;
      } else if (response.status == 404) {
        console.log("error =>", response.data);
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async createCourse(creator_id: string, courseProto: Course) {
      let formData = new FormData();

      let id = 1;

      formData.append("creator_id", creator_id);
      formData.append("formation_id", String(this.active_training));
      formData.append("title", courseProto.title);
      formData.append("content", courseProto.content);
      formData.append("image", courseProto.image as File);
      formData.append("order", String(courseProto.order));

      console.log("Nouveau cours =>", courseProto);

      const response: AxiosResponse = await service.createCourse(formData);

      if (response.status == 200 || response.status == 201) {
        let data = response.data as CourseResponse;
        id = data.data.id ?? 1;
        this.courses.push({ ...data.data });
      } else if (response.status == 400) {
        console.log("error =>", response.data);
      }

      return id;
    },

    async updateCourse(creator_id: string, courseProto: Course) {
      if (creator_id != courseProto.creator_id) {
        notify({
          color: "error",
          message: "You aren't able to modify this courses...",
          visible: true,
        });
      } else {
        let formData = new FormData();

        formData.append("creator_id", creator_id);
        formData.append("formation_id", String(this.active_training));
        formData.append("title", courseProto.title);
        formData.append("content", courseProto.content);
        formData.append("image", courseProto.image as File);
        formData.append("order", String(courseProto.order));

        console.log("Nouveau cours =>", courseProto);

        const response: AxiosResponse = await service.updateCourse(
          courseProto.id ?? 1,
          formData
        );

        if (response.status == 200 || response.status == 201) {
          let data = response.data as CourseResponse;

          const index = this.courses.findIndex((u) => u.id == data.data.id);
          if (index !== -1) {
            this.courses[index] = data.data;
          }
        } else if (response.status == 400) {
          console.log("error =>", response.data);
        }
      }
    },

    async deleteCourse(courseId: number) {
      const response: AxiosResponse =
        service.deleteCourse && (await service.deleteCourse(courseId));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as CourseResponse;

        console.log("data-training-deleted =>", data.data);

        // Supprimer le domaine
        const index = this.courses.findIndex((d) => d.id === data.data.id);
        this.courses.splice(index, 1);
      } else if (response.status == 500) {
        console.log("error =>", response.data.message);
      }
    },
  },
});

export default useCoursesStore;
