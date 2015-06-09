/**
	生成VM模板
 */
module.exports = function (grunt) {
	config = require("tools/config");
	
    grunt.registerTask('default', 'create template', function() {
		grunt.file.delete(config.output);
		grunt.file.mkdir(config.output);
		grunt.file.mkdir(config.output + "/template");
		
		var reg_config = {
			layout:/<layout[a-zA-Z0-9"'=/.\s,-\uff01-\uff5e]*?><\/layout>/ig,
			src:/src=('|")([a-zA-Z0-9"'=/.,-\uff01-\uff5e]*)('|")/,
			forStart:/<for[^\>]*\>/ig,
			forEnd:/<\/for>/ig
		};
		
		function formatVM(filepath, filename, dirpath) {
			dirpath = dirpath ? dirpath + "/" : "";
			
			var content = grunt.file.read(filepath);
			content = content.replace(reg_config.layout, function(match) {
				console.log(match)
				var src = match.match(reg_config.src);
				if(src && src[2]) {
					return "#parse(\""+src[2]+"\")" + " <!-- " + match + " -->";
				}else {
					return match;
				}
			});
			content = content.replace(reg_config.forStart, function(match) {
				return "#foreach" + " <!-- " + match + " -->";
			});
			content = content.replace(reg_config.forEnd, function(match) {
				return "#end";
			});
			grunt.file.write(dirpath+filename, content);
			
			console.log(filepath + " to " + dirpath + filename + " done.")
		}
		
		grunt.file.recurse("./", function(abspath, rootdir, subdir, filename) {
			if(config.files == "*" || (config.files instanceof Array && config.files.join(",").indexOf(abspath) >= 0)) {
				formatVM(abspath, filename, config.output);
			}
		});
		
		grunt.file.recurse(config.template, function(abspath, rootdir, subdir, filename) {
			if (abspath.indexOf('.' != 0) && abspath.indexOf("/.") < 0) {
				formatVM(abspath, filename, config.output + "/template");
			}
		});
		
		grunt.log.write('create VM-Template success.').ok();
	});
};