
module.exports = {
    docker: {
        ports: [3001, 3002, 3003]
    },
    basicAuth: {
        name: 'admin',
        password: 'password'
    },
    timeout: 15000,
    defaults: {
        launch: {

        },
        pdf: {// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
            displayHeaderFooter: true,
            format: 'A4',
            margin: {
                // top: '100px',
                // right: '20px',
                // bottom: '100px',
                // left: '20px'
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            },
            scale: 0.7,
        },
        // pdf : {
        //
        //     format: 'letter',
        //     displayHeaderFooter: true,
        //     footerTemplate:  '<style>body {color: red;}h1{font-size: 12px;}</style><h1>Page <span class="pageNumber"></span> of <span class="totalPages"></span></h1>',
        //
        //         scale: 0.7,
        //     margin: {
        //         top: '100px',
        //         right: '20px',
        //         bottom: '100px',
        //         left: '20px'
        //     },
        // }
    },
}