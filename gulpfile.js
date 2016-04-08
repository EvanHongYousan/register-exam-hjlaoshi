/**
 * Created by yantianyu on 2016/4/8.
 */
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');

gulp.task('default', function () {
    return gulp.src('app/views/*.html')
        .pipe(templateCache())
        .pipe(gulp.dest('app/js'));
});