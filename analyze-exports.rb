#!/usr/bin/env ruby

require 'json'

exports = JSON.parse(ARGF.read)

APPROVED_PATH = "/Users/jdh/projects/office-ui-fabric-react/packages/office-ui-fabric-react/lib/index.d.ts"

problematic = exports
                .reject { |e| (e['exports'] || []).index(APPROVED_PATH) }
                .reject { |e| e['name'] =~ /Example/ }
                .reject { |e| (e['exports'] || []).any? { |path| path =~ /scss.d.ts$/ } }
                .reject { |e| (e['exports'] || []).any? { |path| path =~ /\/examples\// } }
                .reject { |e| (e['exports'] || []).any? { |path| path =~ /doc.d.ts$/ } }

result = problematic.map { |p| { :name => p['name'], :src => p['exports'].sort_by(&:length).last }}

segregate_styles = result.group_by { |r| (r[:name] == 'getStyles' || r[:src] =~ /classNames.d.ts$/) ? :styles : :other }

puts ({
        :styles => {
          :count => segregate_styles[:styles].length,
          :result => segregate_styles[:styles]
        },
        :other => {
          :count => segregate_styles[:other].length,
          :result => segregate_styles[:other]
        },
      }).to_json
