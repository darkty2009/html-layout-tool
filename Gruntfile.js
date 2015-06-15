/**
 生成VM模板
 */
module.exports = function (grunt) {
    var build_config = grunt.file.readJSON("Gruntfile_Config.json");
    var version = "temp";

    function initConfig() {
        var concat_config = {};
        concat_config[build_config.build + '/' + version + '/htmlt.js'] = [build_config.source + '/seajs.js', build_config.build + '/' + version + '/transport/*.js', build_config.build + '/' + version + '/transport/boot/init.js'];

        var uglify_config = {};
        uglify_config[build_config.build + '/' + version + '/htmlt.min.js'] = [build_config.build + '/' + version + '/htmlt.js'];

        grunt.initConfig({
            transport: {
                js: {
                    options: {
                        paths: [build_config.source],
                        debug: false
                    },
                    files: [{
                        expand: true,
                        cwd: build_config.source,
                        src: ['**/*.js'],
                        dest: build_config.build + '/' + version + '/transport'
                    }]
                }
            },
            concat: {
                js: {
                    options: {
                        noncmd: true
                    },
                    files: concat_config
                }
            },
            uglify: {
                js: {
                    files: uglify_config
                }
            },
            copy: {
                all: {
                    files: [{
                        expand:true,
                        cwd: build_config.output.source,
                        src: '**/*',
                        dest: build_config.output.target
                    }]
                }
            },
            clean: {
                build: {
                    files:[{
                        src: [build_config.build + '/' + version + '/transport']
                    }]
                }
            }
        });
    }

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-cmd-transport');

    grunt.registerMultiTask('clean', 'remove temp dict', function(arg1, arg2) {
        var files = this.data.files;
        files.forEach(function(file) {
            var expandFiles = grunt.file.expand(file.src);
            expandFiles.forEach(function(item) {
                grunt.file.delete(item);
            });
        });
    });

    grunt.registerTask('build', 'build html-layout-tool', function(arg1) {
        version = arg1 || "temp";
        initConfig();
        grunt.task.run(['transport:js', 'concat:js', 'uglify:js', 'clean:build']);
    });

    grunt.registerTask('compile', 'create template', function() {
        var reg_config = {
            layout:/<layout[a-zA-Z0-9"'=/.\s,-\uff01-\uff5e]*?><\/layout>/ig,
            src:/src=('|")([a-zA-Z0-9"'=/.,-\uff01-\uff5e]*)('|")/,
            forStart:/<for[^\>]*\>/ig,
            from:/from=('|")([a-zA-Z0-9"'=/.,-\uff01-\uff5e]*)('|")/,
            mod:/mod=('|")([a-zA-Z0-9"'=/.,-\uff01-\uff5e]*)('|")/,
            forEnd:/<\/for>/ig,
            ifStart:/<if[^\>]*\>/ig,
            cond:/cond=('|")([a-zA-Z0-9"'=/.,-\uff01-\uff5e]*)('|")/,
            ifEnd:/<\/if>/ig,
            vars:/\{\$([^\}]+)\}/ig
        };

        function formatVM(filepath, filename, dirpath) {
            dirpath = dirpath ? dirpath + "/" : "";

            var content = grunt.file.read(filepath);
            content = content.replace(reg_config.layout, function(match) {
                var src = match.match(reg_config.src);
                if(src && src[2]) {
                    return build_config.engine.layout.replace(/\$0/ig, src[2]);
                }else {
                    return build_config.engine.layout;
                }
            });
            content = content.replace(reg_config.forStart, function(match) {
                var result = build_config.engine.for_start;

                var from = match.match(reg_config.from);
                if(from && from[2]) {
                    result = build_config.engine.for_start.replace(/\$0/ig, from[2]).replace(/\$1/ig, 'data');
                }
                var mod = match.match(reg_config.mod);
                if(mod && mod[2]) {
                    mod = mod[2].split(',');
                    if(mod && mod.length >= 3) {
                        result = result.replace(/\$2/ig, mod[0]).replace(/\$3/ig, mod[1]).replace(/\$4/ig, mod[2]);
                    }
                }

                return result;
            }).replace(reg_config.forEnd, function(match) {
                return build_config.engine.for_end;
            }).replace(reg_config.ifStart, function(match) {
                var cond = match.match(reg_config.cond);
                if(cond && cond[2]) {
                    return build_config.engine.if_start.replace(/\$0/ig, cond[2]);
                }else {
                    return build_config.engine.if_start;
                }
            }).replace(reg_config.ifEnd, function(match) {
                return build_config.engine.if_end;
            }).replace(reg_config.vars, function(match, key) {
                if(key) {
                    return build_config.engine.vars.replace(/\$0/ig, key);
                }else {
                    return build_config.engine.vars;
                }
            });
            grunt.file.write(dirpath+filename, content);

            console.log(filepath + " to " + dirpath + filename + " done.")
        }

        if(build_config.output.files instanceof Array) {

        }else {
            grunt.file.recurse(build_config.output.source, function(abspath, rootdir, subdir, filename) {
                console.log(abspath, rootdir, subdir, filename);
                if(subdir) {
                    formatVM(abspath, filename, build_config.output.target + '/' + subdir);
                }else {
                    formatVM(abspath, filename, build_config.output.target);
                }
            });
        }

        grunt.log.write('create template success.').ok();
    });
};