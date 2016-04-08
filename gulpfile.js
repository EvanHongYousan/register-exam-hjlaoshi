/**
 * Created by yantianyu on 2016/4/8.
 */
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var sass = require('gulp-sass');

gulp.task('default', ['views','sass']);

gulp.task('views', function () {
    return gulp.src('app/views/*.html')
        .pipe(templateCache({
            module: 'templatescache',
            standalone: true
        }))
        .pipe(gulp.dest('app/js'));
});

gulp.task('sass', function(done) {
    gulp.src(['app/sass/main.scss'])
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('app/css/'))
        .on('end', done);
});