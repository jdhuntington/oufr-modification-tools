#!/usr/bin/env ruby

FROM = ARGV[0]
TO   = ARGV[1]

require 'logger'
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

def change logger, filename, from, to
  contents = File.read(filename)
  modified = contents.gsub(from, to)
  if modified != contents
    logger.info("ag-aware-search-replace") { filename }
    File.open(filename, 'w') { |f| f.print modified }
  end
end

files = %x{ ag -l "#{FROM}" }.split("\n")
files.each do |f|
  change logger, f, FROM, TO
end
