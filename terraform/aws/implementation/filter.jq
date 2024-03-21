reduce .[] as $item ({}; .[$item.name | sub("^phdi-charts/";"")] |= if . == null then $item.version else if . < $item.version then $item.version else . end end)
