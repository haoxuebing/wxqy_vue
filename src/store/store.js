import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        stuName: "Caiyw",
        objectName: "行为规范",
        score: 10,

        firstName: "Cai",
        lastName: "yangwei",

        todos: [
            { id: 1, text: '...', done: true },
            { id: 2, text: '...', done: false },
            { id: 3, text: '...', done: false }
        ]
    },
    mutations: {
        updateScore(state, num) {
            state.score = num;
        }
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done);
        },
        doneTodosCount: (state, getters) => {
            return getters.doneTodos.length;
        },
        getDoneByid: (state) => (id) => {
            return state.todos.find(d => d.id === id);
        }
    },
    actions: {
        getDoneByid(context, num) {
            commit('updateScore', num);
        }
    }
});
//export default store;