#!/usr/bin/env ruby

start_locations = File.read(ARGV[0]).strip.split("\n").sort
end_locations = File.read(ARGV[1]).strip.split("\n").sort

trimmed_start_locations = start_locations - end_locations
trimmed_end_locations = end_locations - start_locations

def best_match needle, haystack
  segments = needle.split "/"

  haystack
    .select { |x| File.basename(x) == File.basename(needle) }
    .sort_by { |x| (segments & x.split("/")).length }
    .last
end

moves = trimmed_end_locations
          .map { |x| [x, best_match(x, trimmed_start_locations)] }
          .select { |x| x[0] && x[1] }

used = []

puts "#!/bin/bash\nset -uex"
moves.each do |move|
  if used.index(move[1])
    STDERR.puts "#{move[1]} used already"
  else
    puts "mkdir -p #{File.dirname move[0]}"
    puts "git mv #{move[1]} #{move[0]}"
    used << move[1]
  end
end
