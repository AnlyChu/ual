/**
 * Created by Anly.Z on 16/7/1.
 */

'use strict';

var gulp = require('gulp'),
	mincss = require('gulp-mini-css'),
	ngAnnotate = require('gulp-ng-annotate'),
	ngmin = require('gulp-ngmin'),
	minifyCss = require('gulp-minify-css'),
	stripDebug = require('gulp-strip-debug'),
	concat = require('gulp-concat'),
  jshint = require('jshint'),
	uglify = require('gulp-uglify');

var src = 'src/app',
	lib = 'src/lib',
	dist = 'src/app/dist';


////执行压缩混淆前，先执行jshint
//gulp.task('default', ['jshint'], function() {
//	gulp.start('minifyjs');
//});
//
////压缩，合并 js
//gulp.task('minifyjs',function() {
//	return gulp.src('./www/js/**/*.js')      //需要操作的文件
//		.pipe(concat('main.js'))    //合并所有js到main.js
//		.pipe(gulp.dest('./www/dist'))       //输出到文件夹
//		.pipe(ngAnnotate())
//		.pipe(ngmin({dynamic: false}))//Pre-minify AngularJS apps with ngmin
//		.pipe(stripDebug())//除去js代码中的console和debugger输出
//		.pipe(uglify({outSourceMap: false}))    //压缩
//		.pipe(gulp.dest('./www/dist'));  //输出
//});


gulp.task('mincss', function () {
	gulp.src([ src + '/common/login/login.css', lib + '/bootstrap-3.3.5-dist/css/bootstrap.min.css',src + '/ual.css'])
		.pipe(mincss())
		.pipe(concat("ual.min.css"))
		.pipe(gulp.dest(dist));
});

gulp.task('minjs', function () {
	gulp.src(src + "/**/*.js")
		.pipe(concat("ual.min.js"))
		.pipe(ngAnnotate())
		.pipe(ngmin({dynamic: false}))
		.pipe(stripDebug())
		.pipe(uglify({outSourceMap: false}))
		.pipe(gulp.dest(dist));
});

gulp.task('minlibjs', function () {
	gulp.src([lib + '/jquery/jquery-1.11.1.min.js',
		lib + '/angular/angular.min.js',
		lib + '/bootstrap-3.3.5-dist/js/bootstrap.min.js',
		lib + '/angular-ui-router/angular-ui-router.min.js',
		lib + '/angular-animate/angular-animate.min.js',
		lib + '/angular-resource/angular-resource.min.js'
	])
		.pipe(concat("lib.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(dist));
});

gulp.task('watch', function () {
	gulp.watch(src + '/**/*.css', ['mincss']);
	gulp.watch(src + '/**/*.js' ['minjs']);
});

gulp.task('default', function () {
	gulp.run( 'mincss','minlibjs','minjs');
});

gulp.task('jshint', function () {
	gulp.src(src + "/**/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});