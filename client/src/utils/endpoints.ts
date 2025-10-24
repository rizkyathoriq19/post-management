const _endpoints = {
    // Version 1
    signin: '/api/v1/auth/signin',
    signup: '/api/v1/auth/signup',
    signout: '/api/v1/auth/signout',

    getAll: '/api/v1/post/all',
    getById: '/api/v1/post/detail/:id',
    create: '/api/v1/post/create',
    update: '/api/v1/post/update/:id',
    delete: '/api/v1/post/delete/:id',
}

/**
 *
 * @param path
 * @param params
 * @returns
 */
export const endpoints = (
    path: keyof typeof _endpoints,
    params?: Record<string, string>
) => {
    if (!params) return _endpoints[path]
    return _endpoints[path].replace(/:(\w+)/g, (_, key) => params?.[key] || '')
}
