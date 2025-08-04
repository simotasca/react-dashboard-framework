import Service from "@/lib/api/Service";

const service = new Service("https://jsonplaceholder.typicode.com");

export const api = {
  posts: {
    list: () => service.get<Post[]>("/posts"),
  },
};

type Post = { id: number; title: string; body: string; userId: number };
