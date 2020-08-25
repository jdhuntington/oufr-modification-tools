#!/usr/bin/env ruby

require 'json'
require 'logger'

class ExportStatement
  def initialize args
    @args = args
    @upstreams = []
  end

  def filename
    @args['filename']
  end

  def matches log, other_file
    filename == "#{other_file}.d.ts"
  end

  def << other
    @upstreams << other
  end

  def upstreams
    @_cached_upstreams ||= begin
                             result = []
                             @upstreams.each do |u|
                               result << u
                               u.upstreams.each do |uu|
                                 result << uu
                               end
                             end
                             result
                           end
  end

  def log_upstreams log
    @upstreams.each do |u|
      log.debug(filename) { u.filename }
    end
  end
end

class Declaration < ExportStatement
  def is_declaration?
    true
  end

  def export_filenames
    ([filename] + upstreams.map(&:filename)).sort.uniq
  end

  def name
    @args['declaration']
  end
end

class ReExport < ExportStatement
  def is_declaration?
    false
  end

  def target
    @args['target']
  end
end

class Factory
  def  self.instance_for obj
    if obj['declaration']
      Declaration.new obj
    else
      ReExport.new obj
    end
  end
end

def locate_files log, haystack, needle
  haystack.filter { |h| h.matches log, needle }
end

exports = ARGF.read.split("\n").map {|x| Factory.instance_for(JSON.parse(x)) }
all = exports.group_by(&:is_declaration?)
declarations = all[true]
reexports = all[false]
log = Logger.new STDOUT
log.level = Logger::WARN

reexports.each do |e|
  locate_files(log, exports, e.target).each { |f| f << e }
end

result = []

declarations.each do |d|
  obj = {
    :name => d.name,
    :exports => d.export_filenames
  }
  result << obj
end

puts result.to_json


