#!/usr/bin/env ruby

require 'json'
require 'fileutils'
require 'logger'
logger = Logger.new(STDOUT)
logger.level = Logger::INFO

MOVE_MAP = JSON.parse(File.read(ARGV.first))

MOVE_MAP.each do |k,v|
  next if k == '-'
  package_root = File.join('src', 'packages', k)
  components_root = File.join package_root, 'components'
  FileUtils.mkdir_p components_root
  v.each do |file|
    logger.debug file
    source_component = File.join('src', 'components', file)
    lib_export_path = File.join('src', "#{file}.ts")
    FileUtils.mv lib_export_path, package_root
    File.open(lib_export_path, 'w') do |f|
      f.puts "export * from \'./packages/#{k}/#{file}\';"
    end
    if !File.exist?(source_component)
      logger.warn("enforce loop") { "#{file.inspect} does not appear to be a component, skipping component move." }
      next
    end
    source_component = source_component.downcase if file == 'Pickers' # Case exception
    FileUtils.mv source_component, components_root
  end
end
