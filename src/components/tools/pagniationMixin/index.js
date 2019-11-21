import pagniation from '@/components/tools/Pagniation.vue';
export default {
  components: { pagniation },
  data() {
    return {
      form: {
        current: 0,
        pageSize: 30
      },
      totalPage: 0,
      totalNum: 0
    };
  },
  methods: {
    //分页组件改变页码
    handleChangePage(page) {
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getData();
    }
  }
};
