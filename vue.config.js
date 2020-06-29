module.exports = {
    // 将examples目录添加为新的页面
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    lintOnSave: false,
    devServer: {
        overlay: {
            warning: false,
            errors: false
        }
    }
}