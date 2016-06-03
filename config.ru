require 'sinatra'
require './app'

configure do
	# set :protection, :except => :frame_options
	disable :protection
end

run Sinatra::Application

