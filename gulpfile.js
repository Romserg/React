const gulp = require('gulp'),
    react = require('gulp-react'),
    watch = require('gulp-watch'),
    server = require('gulp-server-livereload'),
    browserify = require('gulp-browserify');

function buildReact() {
    try {
        return gulp.src('./jsx/*.jsx')
            .pipe(react())
            .pipe(browserify())
            .pipe(gulp.dest('dist'));
    } catch (e) {
        console.error(e)
    }
}
//Таски запуск реакта, живая перезагрузка, запуск сервера
gulp.task('default', buildReact);

gulp.task('watch', ()=> {
    buildReact()
    watch('./jsx/**', buildReact);
})
gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(server({
            defaultFile:"./index.html",
            fallback:"./index.html",
            port:9000,
            livereload: true,
            open: true
        }));
});