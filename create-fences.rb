#!/usr/bin/env ruby

require 'json'

Dir['*'].each do |d|
  obj = {
    :tags => [d],
#    :imports => [],
  }
  File.open(File.join(d, 'fence.json'), 'w') {|f| f.print obj.to_json}
end
