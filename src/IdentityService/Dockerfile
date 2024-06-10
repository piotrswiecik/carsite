FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

EXPOSE 80

# copy .csproj and restore as distinct layers - cache optimization

COPY Carsite.sln Carsite.sln
COPY src/AuctionService/AuctionService.csproj src/AuctionService/AuctionService.csproj
COPY src/SearchService/SearchService.csproj src/SearchService/SearchService.csproj
COPY src/GatewayService/GatewayService.csproj src/GatewayService/GatewayService.csproj
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj
COPY src/IdentityService/IdentityService.csproj src/IdentityService/IdentityService.csproj
COPY src/BiddingService/BiddingService.csproj src/BiddingService/BiddingService.csproj

# restore deps
RUN dotnet restore Carsite.sln

# copy app folders
COPY src/IdentityService src/IdentityService

WORKDIR /app/src/IdentityService

RUN dotnet publish -c Release -o /app/src/out

# runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

COPY --from=build /app/src/out .

ENTRYPOINT ["dotnet", "IdentityService.dll"]