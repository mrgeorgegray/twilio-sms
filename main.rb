require 'sinatra'
require 'twilio-ruby'


get '/' do
  erb :index
end

post '/sms' do
  @message = params[:location]
  @phone = params[:phone]

  # REAL CREDENTIALS
  #require_relative 'twilio_crendentails.rb'

  # TEST CREDENTIALS
  require_relative 'test_crendentails.rb'

  @client = Twilio::REST::Client.new(@@account_sid, @@auth_token)

  begin
    @client.account.sms.messages.create(
      :from => @@from,
      :to => @phone,
      :body => @message
    )
    redirect('/?status=sent')
  rescue Twilio::REST::RequestError => e
    redirect('/?status=error')
  end
end
