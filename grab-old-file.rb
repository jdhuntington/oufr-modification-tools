#!/usr/bin/env ruby

require 'fileutils'

file = ARGV[0]

name = File.basename file

hits = Dir["./**/#{name}"]

if hits.length != 1
  STDERR.puts hits.inspect
  throw "got multiple matches"
end

puts `git checkout master #{file}`
FileUtils.mv file, hits[0]
