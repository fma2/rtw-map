require 'sinatra'

configure do
	set :protection, :except => :frame_options
end



require './app'

run Sinatra::Application

