import axios from 'axios'
import { ENDPOINT_TASK } from '../constants/Api'

export const CREATE_TASK_START = 'CREATE_TASK_START';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILED = 'CREATE_TASK_FAILED';
export const LIST_TASKS_START = 'LIST_TASKS_START';
export const LIST_TASKS_SUCCESS = 'LIST_TASKS_SUCCESS';
export const LIST_TASKS_FAILED = 'LIST_TASKS_FAILED';
export const LIST_MORE_TASKS_START = 'LIST_MORE_TASKS_START';
export const LIST_MORE_TASKS_SUCCESS = 'LIST_MORE_TASKS_SUCCESS';
export const LIST_MORE_TASKS_FAILED = 'LIST_MORE_TASKS_FAILED';
export const RETRIEVE_TASK_START = 'RETRIEVE_TASK_START';
export const RETRIEVE_TASK_SUCCESS = 'RETRIEVE_TASK_SUCCESS';
export const RETRIEVE_TASK_FAILED = 'RETRIEVE_TASK_FAILED';
export const UPDATE_TASK_START = 'UPDATE_TASK_START';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILED = 'UPDATE_TASK_FAILED';
export const DELETE_TASK_START = 'DELETE_TASK_START';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILED = 'DELETE_TASK_FAILED';
export const RETRIEVE_TASK_META_START = 'RETRIEVE_TASK_META_START';
export const RETRIEVE_TASK_META_SUCCESS = 'RETRIEVE_TASK_META_SUCCESS';
export const RETRIEVE_TASK_META_FAILED = 'RETRIEVE_TASK_META_FAILED';
export const LIST_TASK_ACTIVITY_START = 'LIST_TASK_ACTIVITY_START';
export const LIST_TASK_ACTIVITY_SUCCESS = 'LIST_TASK_ACTIVITY_SUCCESS';
export const LIST_TASK_ACTIVITY_FAILED = 'LIST_TASK_ACTIVITY_FAILED';
export const LIST_MORE_TASK_ACTIVITY_START = 'LIST_MORE_TASK_ACTIVITY_START';
export const LIST_MORE_TASK_ACTIVITY_SUCCESS = 'LIST_MORE_TASK_ACTIVITY_SUCCESS';
export const LIST_MORE_TASK_ACTIVITY_FAILED = 'LIST_MORE_TASK_ACTIVITY_FAILED';
export const CREATE_TASK_INTEGRATION_START = 'CREATE_TASK_INTEGRATION_START';
export const CREATE_TASK_INTEGRATION_SUCCESS = 'CREATE_TASK_INTEGRATION_SUCCESS';
export const CREATE_TASK_INTEGRATION_FAILED = 'CREATE_TASK_INTEGRATION_FAILED';
export const RETRIEVE_TASK_INTEGRATION_START = 'RETRIEVE_TASK_INTEGRATION_START';
export const RETRIEVE_TASK_INTEGRATION_SUCCESS = 'RETRIEVE_TASK_INTEGRATION_SUCCESS';
export const RETRIEVE_TASK_INTEGRATION_FAILED = 'RETRIEVE_TASK_INTEGRATION_FAILED';


export function createTask(task, attachments) {
    return dispatch => {
        dispatch(createTaskStart(task));

        if(attachments.length) {
            var data = new FormData();
            Object.keys(task).map((key, idx) => {
                if((Array.isArray(task[key]) && task[key].length) || (!Array.isArray(task[key]) && task[key] != null)) {
                    data.append(key, task[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });

            $.ajax({
                url: ENDPOINT_TASK,
                type: "POST",
                data: data,
                processData: false,
                contentType: false
            }).then(function (data) {
                dispatch(createTaskSuccess(data))
            }, function (data) {
                dispatch(createTaskFailed(data));
            });
        } else {
            axios.post(ENDPOINT_TASK, task)
                .then(function(response) {
                    dispatch(createTaskSuccess(response.data))
                }).catch(function(response) {
                dispatch(createTaskFailed(response.data))
            });
        }
    }
}

export function createTaskStart(task) {
    return {
        type: CREATE_TASK_START,
        task
    }
}

export function createTaskSuccess(task) {
    return {
        type: CREATE_TASK_SUCCESS,
        task
    }
}

export function createTaskFailed(error) {
    return {
        type: CREATE_TASK_FAILED,
        error
    }
}

export function listTasks(filter) {
    return dispatch => {
        dispatch(listTasksStart(filter));
        axios.get(ENDPOINT_TASK, {params: filter})
            .then(function(response) {
                dispatch(listTasksSuccess(response.data, filter))
            }).catch(function(response) {
                dispatch(listTasksFailed(response.data))
            });
    }
}

export function listTasksStart(filter) {
    return {
        type: LIST_TASKS_START,
        filter
    }
}

export function listTasksSuccess(response, filter) {
    return {
        type: LIST_TASKS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter
    }
}

export function listTasksFailed(error) {
    return {
        type: LIST_TASKS_FAILED,
        error
    }
}

export function listMoreTasks(url) {
    return dispatch => {
        dispatch(listMoreTasksStart(url));
        axios.get(url)
            .then(function(response) {
                dispatch(listMoreTasksSuccess(response.data))
            }).catch(function(response) {
            dispatch(listMoreTasksFailed(response.data))
        });
    }
}

export function listMoreTasksStart(url) {
    return {
        type: LIST_MORE_TASKS_START,
        url
    }
}

export function listMoreTasksSuccess(response) {
    return {
        type: LIST_MORE_TASKS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count
    }
}

export function listMoreTasksFailed(error) {
    return {
        type: LIST_MORE_TASKS_FAILED,
        error
    }
}

export function retrieveTask(id) {
    return dispatch => {
        dispatch(retrieveTaskStart(id));
        dispatch(retrieveTaskMeta(id));
        axios.get(ENDPOINT_TASK + id + '/')
            .then(function(response) {
                dispatch(retrieveTaskSuccess(response.data))
            }).catch(function(response) {
                dispatch(retrieveTaskFailed(response.data))
            });
    }
}

export function retrieveTaskStart(id) {
    return {
        type: RETRIEVE_TASK_START,
        id
    }
}

export function retrieveTaskSuccess(task) {
    return {
        type: RETRIEVE_TASK_SUCCESS,
        task
    }
}

export function retrieveTaskFailed(error) {
    return {
        type: RETRIEVE_TASK_FAILED,
        error
    }
}

export function updateTask(id, data) {
    return dispatch => {
        dispatch(updateTaskStart(id));
        axios.patch(ENDPOINT_TASK + id + '/', data)
            .then(function(response) {
                dispatch(updateTaskSuccess(response.data))
            }).catch(function(response) {
                dispatch(updateTaskFailed(response.data))
            });
    }
}

export function updateTaskStart(id) {
    return {
        type: UPDATE_TASK_START,
        id
    }
}

export function updateTaskSuccess(task) {
    return {
        type: UPDATE_TASK_SUCCESS,
        task
    }
}

export function updateTaskFailed(error) {
    return {
        type: UPDATE_TASK_FAILED,
        error
    }
}

export function deleteTask(id) {
    return dispatch => {
        dispatch(deleteTaskStart(id));
        axios.delete(ENDPOINT_TASK + id + '/')
            .then(function() {
                dispatch(deleteTaskSuccess(id));
            }).catch(function(response) {
                dispatch(deleteTaskFailed(response.data));
            });
    }
}

export function deleteTaskStart(id) {
    return {
        type: DELETE_TASK_START,
        id
    }
}

export function deleteTaskSuccess(id) {
    return {
        type: DELETE_TASK_SUCCESS,
        id
    }
}

export function deleteTaskFailed(error) {
    return {
        type: DELETE_TASK_FAILED,
        error
    }
}

export function retrieveTaskMeta(id) {
    return dispatch => {
        dispatch(retrieveTaskMetaStart(id));
        axios.get(ENDPOINT_TASK + id + '/meta/')
            .then(function(response) {
                dispatch(retrieveTaskMetaSuccess(response.data))
            }).catch(function(response) {
                dispatch(retrieveTaskMetaFailed(response.data))
            });
    }
}

export function retrieveTaskMetaStart(id) {
    return {
        type: RETRIEVE_TASK_META_START,
        id
    }
}

export function retrieveTaskMetaSuccess(response) {
    return {
        type: RETRIEVE_TASK_META_SUCCESS,
        task: response.task,
        meta: {participation: response.participation, payment: response.payment}
    }
}

export function retrieveTaskMetaFailed(error) {
    return {
        type: RETRIEVE_TASK_META_FAILED,
        error
    }
}

export function listTaskActivity(id, filter) {
    return dispatch => {
        dispatch(listTaskActivityStart(id, filter));
        axios.get(ENDPOINT_TASK + id + '/activity/', {params: filter})
            .then(function(response) {
                dispatch(listTaskActivitySuccess(response.data, id, filter))
            }).catch(function(response) {
            dispatch(listTaskActivityFailed(response.data, id))
        });
    }
}

export function listTaskActivityStart(id, filter) {
    return {
        type: LIST_TASK_ACTIVITY_START,
        id,
        filter
    }
}

export function listTaskActivitySuccess(response, id, filter) {
    return {
        type: LIST_TASK_ACTIVITY_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        id,
        filter
    }
}

export function listTaskActivityFailed(error, id) {
    return {
        type: LIST_TASK_ACTIVITY_FAILED,
        error,
        id
    }
}

export function listMoreTaskActivity(url) {
    return dispatch => {
        dispatch(listMoreTaskActivityStart(url));
        axios.get(url)
            .then(function(response) {
                dispatch(listMoreTaskActivitySuccess(response.data))
            }).catch(function(response) {
            dispatch(listMoreTaskActivityFailed(response.data))
        });
    }
}

export function listMoreTaskActivityStart(url) {
    return {
        type: LIST_MORE_TASK_ACTIVITY_START,
        url
    }
}

export function listMoreTaskActivitySuccess(response) {
    return {
        type: LIST_MORE_TASK_ACTIVITY_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count
    }
}

export function listMoreTaskActivityFailed(error) {
    return {
        type: LIST_MORE_TASK_ACTIVITY_FAILED,
        error
    }
}

export function createTaskIntegration(id, provider, data) {
    return dispatch => {
        dispatch(createTaskIntegrationStart(id));
        axios.post(ENDPOINT_TASK + id + '/integration/' + provider + '/', data)
            .then(function(response) {
                dispatch(createTaskIntegrationSuccess(response.data, provider))
            }).catch(function(response) {
            dispatch(createTaskIntegrationFailed(response.data, provider))
        });
    }
}

export function createTaskIntegrationStart(id, provider) {
    return {
        type: CREATE_TASK_INTEGRATION_START,
        id,
        provider
    }
}

export function createTaskIntegrationSuccess(response, provider) {
    return {
        type: CREATE_TASK_INTEGRATION_SUCCESS,
        task: response.task,
        provider,
        integration: response
    }
}

export function createTaskIntegrationFailed(error, provider) {
    return {
        type: CREATE_TASK_INTEGRATION_FAILED,
        error,
        provider
    }
}

export function retrieveTaskIntegration(id, provider) {
    return dispatch => {
        dispatch(retrieveTaskIntegrationStart(id));
        axios.get(ENDPOINT_TASK + id + '/integration/' + provider + '/')
            .then(function(response) {
                dispatch(retrieveTaskIntegrationSuccess(response.data, provider))
            }).catch(function(response) {
            dispatch(retrieveTaskIntegrationFailed(response.data, provider))
        });
    }
}

export function retrieveTaskIntegrationStart(id, provider) {
    return {
        type: RETRIEVE_TASK_INTEGRATION_START,
        id,
        provider
    }
}

export function retrieveTaskIntegrationSuccess(response, provider) {
    return {
        type: RETRIEVE_TASK_INTEGRATION_SUCCESS,
        task: response.task,
        provider,
        integration: response
    }
}

export function retrieveTaskIntegrationFailed(error, provider) {
    return {
        type: RETRIEVE_TASK_INTEGRATION_FAILED,
        error,
        provider
    }
}
