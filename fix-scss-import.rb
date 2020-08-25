#!/usr/bin/env ruby

require 'fileutils'
require 'logger'
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

Dir['./**/*.scss'].each do |file|
  contents = File.read(file)
  modified = contents.gsub('../../common/common', '../../../../common/common')
  if modified != contents
    logger.info("scss fixup") { "#{file.inspect} modifed" }
    File.open(file, 'w') { |f| f.print modified }
  end
end
