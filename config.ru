require 'sinatra'
require './app'

configure do
	set :protection, :except => :frame_options
end

run Sinatra::Application

