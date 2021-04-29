<template>
  <div id="vitualList">
    <!-- <el-table
      :data="vitualList"
      style="width: 100%"
      :max-height="500"
      id="table"
      v-loading="loading"
      row-key="id"
    >
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
    </el-table> -->
    <div id="table" >
      <div class="tableWrapper" style="max-height: 200px;overflow-y: auto;">
        <ul>
          <li 
            v-for="(item, index) in vitualList" 
            :key="item.id" 
            :class="[`item-${index}`, 'virtual-item']"
          >
            {{item.id}}{{item.name}}{{item.address}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 如果是每一列的高度都是一致的话，不用维护 heightList 数组，用 Math.floor(scrollTop / itemHeight) 就可以计算出 startindex
 * 如果每一列的高度是不一致的，就需要 heightList 去记录每一列的高度
 * 所以，综上所述，为了覆盖更多的情况，这里都通过维护 heightList 去判断 startIndex
 */
export default {
  name: "VitualList",
  data() {
    return {
      list: [],
      loading: false,
      id: 0,
      // 起始下标，及可视区第一个元素的下标
      startIndex: 0,
      // 虚拟列表的增量，这个值必须大于可视区的行数
      increment: 20,
      // 最大高度
      maxHeight: 500,
      vitualList: [],
      lastScrollTop: 0,
      // 存放已经渲染过的每一列的 height 和 top，方便定位 startIndex
      heightList: [],
      table: null,
      hasNoMore: false
    };
  },
  computed: {
    endIndex() {
      return this.startIndex + this.increment;
    },
    paddingBottom() {
      if (this.endIndex < this.heightList.length) {
        const totalHeight = this.heightList[this.heightList.length - 1]
        const currentHeight = this.heightList[this.endIndex]
        return totalHeight.height + totalHeight.top - currentHeight.height - currentHeight.top;
      }
      return 0;
    }
  },
  methods: {
    fetchData() {
      return new Promise(resolve => {
        if (this.loading) resolve();
        this.loading = true;
        console.log("fetch");
        if (this.list.length < 100) {
          setTimeout(() => {
            this.list.push(...this.random(30));
            this.loading = false;
            resolve();
          }, 500);
        } else {
          this.hasNoMore = true
          this.loading = false;
          resolve();
        }
      });
    },
    random(length = 20) {
      const list = [];
      for (let i = 0; i < length; i++) {
        const item = {
          id: ++this.id,
          name: `第${this.id}个元素`,
          time: new Date().getTime(),
          address: `广州市天河区中山路${this.id}号`
        };
        list.push(item);
      }
      list[3].address += '撒地方水电费撒地方SDK佳都科技打快点快点快点快点快点快点快点开机放放假放假登记反馈的'
      list[5].address += '撒地方水电费撒地方SDK佳都科技打快点快点快点快点快点快点快点开机放放假放假登记反馈的'
      list[7].address += '撒地方水电费撒地方SDK佳都科技打快点快点快点快点快点快点快点开机放放假放假登记反馈的'
      return list;
    },
    /* 根据 startIndex 和 endIndex 设置 padding */
    setPadding() {
      const container = document.querySelector("#table");
      // const table = container.querySelector(".el-table__body-wrapper table");
      const table = container.querySelector(".tableWrapper ul");
      table.style.paddingTop = this.heightList[this.startIndex].top + "px";
      table.style.paddingBottom = this.paddingBottom + "px";
    },
    isScrollDown(scrollTop) {
      const lastScrollTop = this.lastScrollTop;
      this.lastScrollTop = scrollTop;
      if (lastScrollTop < scrollTop) {
        return true;
      }
      return false;
    },
    /* 根据 scrollTop 更新 vitualList， startIndex，setPadding */
    updateVitualList(scrollTop) {
      const index = this.findStartIndex(scrollTop);
      const lastStartIndex = this.startIndex
      if (lastStartIndex !== index) {
        if (this.list.length >= this.increment) {
          if (index + this.increment > this.list.length) {
            // 处理滚到最后的情况
            this.startIndex = this.list.length - this.increment;
          } else {
            this.startIndex = index;
          }
          this.vitualList = this.list.slice(this.startIndex, this.endIndex);
          this.updateHeightList();
          this.setPadding();
        }
      }
    },
    handleScroll() {
      if (this.loading) return;
      const { scrollHeight, scrollTop, clientHeight } = this.table;
      if (this.isScrollDown(scrollTop) && !this.hasNoMore) {
        // 往下滚动
        // if (scrollTop * 1.8 > scrollHeight - clientHeight) {
        if (scrollHeight - clientHeight - scrollTop < 100) {
          this.fetchData().then(() => {
            console.log('fetch')
            this.updateVitualList(scrollTop)
          });
          return;
        }
      }
      this.updateVitualList(scrollTop)
    },
    /* 找出当前滚到第几个 */
    findStartIndex(scrollTop) {
      // 找到第一个大于 scrollTop 的元素，再减去 1 就是当前的 startIndex
      let index = this.heightList.findIndex(item => item.top > scrollTop);
      return index > 0 ? index - 1 : index;
    },
    /* 维护包含每一列的 height 和 top 的数组 */
    updateHeightList() {
      if (this.endIndex <= this.heightList.length) return;
      this.$nextTick(() => {
        // const list = Array.from(this.table.querySelectorAll(".el-table__row"));
        const list = Array.from(this.table.querySelectorAll(".virtual-item"));
        if (this.heightList.length) {
          // 如果不是第一次生成高度数组
          const start = this.heightList.length - this.endIndex;
          list.slice(start, list.length).forEach(item => {
            const lastIndex = this.heightList.length - 1;
            const top = this.heightList[lastIndex].top + this.heightList[lastIndex].height;
            this.heightList.push({
              height: item.clientHeight,
              top
            });
          });
        } else {
          list.forEach((item, index) => {
            let top;
            if (index === 0) {
              top = 0;
            } else {
              top = this.heightList[index - 1].top + this.heightList[index - 1].height;
            }
            this.heightList.push({
              height: item.clientHeight,
              top
            });
          });
        }
      });
    }
  },
  mounted() {
    const table = document.querySelector("#table");
    // this.table = table.querySelector(".el-table__body-wrapper");
    this.table = table.querySelector(".tableWrapper");
    this.table.addEventListener("scroll", this.handleScroll);
    this.fetchData().then(() => {
      this.vitualList = this.list.slice(0, 20);
      this.updateHeightList();
      this.$nextTick(() => {
        this.setPadding();
      });
    });
  },
  destroyed() {
    this.table.removeEventListener('scroll', this.handleScroll)
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.tableWrapper {
  display: flex;
  flex-direction: column;
}
ul, li {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
