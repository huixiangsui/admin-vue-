// import axios from 'axios'
import {
  getToken
} from '@/assets/js/auth'
import http from '@/assets/js/http'
export default {
  data() {
    return {
      searchText: '',
      tableData: [],
      totalSize: 0,
      pageSize: 1,
      currentPage: 1,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      dialogFormVisible: false, //用来控制添加用户对话框的显示和隐藏
      dialogEditFormVisible: false, //控制编辑用户对话框的显示和隐藏
      addUserFormRules: {
        username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到10 个字符',
            trigger: 'blur'
          }
        ],
        password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到10 个字符',
            trigger: 'blur'
          }
        ],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, ],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, ]
      }
    }
  },
  async created() {
    // const {token} = JSON.parse(window.localStorage.getItem('admin-token'))
    // console.log(token)
    // 第一次请求进来请求分页数据：第1页，每页2条
    this.loaderByPage(1, 1)
  },
  methods: {
    handleSizeChange(pageSize) {
      // 将用户选择的页码大小存储起来
      // 用于页码改变之后，再次点击页码的时候获取最新用户选择的每页大小
      this.pageSize = pageSize
      console.log(`每页 ${pageSize} 条`)
      // 页码发生改变
      // 重新请求列表数据
      // 用户改变每页大小之后，我们请求新的数据，以新的每页大小的第1页为准
      this.loaderByPage(1, pageSize)
      // 页码改变之后，不仅让数据到了第1页
      // 同时也要让页码高亮状态也跑到第1页
      this.currentPage = 1
    },
    handleCurrentChange(currentPage) {
      // console.log(`当前页: ${currentPage}`)
      // 将 currentPage 更新为最新点击的页码
      // Element 插件的页码发生改变的时候，不会修改我们的数据 currentPage
      // 我们这里让其每一次页码变化的时候，手动将 currentPage 赋值为当前最新页码
      this.currentPage = currentPage
      this.loaderByPage(currentPage, this.pageSize)

    },
    async loaderByPage(pageNum, pageSize = 1) {
      const res = await this.$http.get('/users', {
        params: {
          pagenum: pageNum,
          pagesize: pageSize,
          query: this.searchText
        }
      })
      console.log(res)
      const {
        users,
        total
      } = res.data.data
      // this.tableData = res.data.data.users
      // this.total = res.data.data.total
      this.tableData = users
      this.totalSize = total
    },
    // 根据搜索的关键字进行搜索
    handleSearch() {
      // console.log('搜索到了')
      this.loaderByPage(1, this.pageSize)
    },
    // handleStateChange (val) {
    //   console.log(val)
    // },
    async handleStateChange(state, userId) {
      // 拿到用户id
      // 拿到switch开关的选中状态state
      // 发起请求改变状态
      // console.log(state,userId)
      // const res = await this.$http.put('/users/'+userId+'/state/'+state)
      const res = await this.$http.put(`/users/${userId}/state/${state}`)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: `用户状态${state?'启用':'禁用'}成功`
        });
      }
    },

    // 添加用户
    async hundleAddUser() {
      // vue的$refs方法可以用来获取设置了ref属性的DOM
      // console.log(this.$refs)  //{addUserForm: VueComponent}
      // console.log(this.$refs['addUserForm'])  //VueComponent
      this.$refs['addUserForm'].validate(async (valid) => {
        console.log(valid) //true/false
        if (!valid) {
          return false
        }
        console.log(this.userForm)
        const res = await this.$http.post('/users', this.userForm)
        console.log(res)
        if (res.data.meta.status === 201) {
          // 关闭对话框
          this.dialogFormVisible = false
          // 添加成功提示消息
          this.$message({
            type: 'success',
            message: '添加用户成功'
          })
          // 添加用户成功之后清空表单内容
          for (let key in this.userForm) {
            this.userForm[key] = ''
          }
          this.loaderByPage(this.currentPage, this.pageSize)
        }
      });

    },
    
    // 删除用户
    async handleDeleteUser (user) {
    //   console.log(user)
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {id:userId} = user
        const res = await this.$http.delete(`/users/${userId}`)
        console.log(res)
        if(res.data.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });   
          this.loaderByPage(this.currentPage,this.pageSize)
        }
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //根据ID查询用户信息，将点击编辑的用户信息动态渲染到页面上
    async handleShowEditForm(user) {
      this.dialogEditFormVisible = true
      const res = await this.$http.get(`/users/${user.id}`)
      console.log(res)
      this.editUserForm = res.data.data
    },
    // 处理编辑用户
    async hundleEditUser() {
        // console.log('编辑用户')
        const {id: userId} = this.editUserForm
        const res = await this.$http.put(`/users/${userId}`,this.editUserForm)
        // console.log(res)
        if(res.data.meta.status===200) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          });  
          this.dialogEditFormVisible = false
          this.loaderByPage(this.currentPage,this.pageSize)
        }
    }
  }

}
