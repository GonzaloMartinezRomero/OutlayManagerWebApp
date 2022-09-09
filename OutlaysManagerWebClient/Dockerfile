#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM node:lts-buster-slim AS node_base
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
COPY --from=node_base . .
RUN npm install -g @angular/cli

WORKDIR /src
COPY ["OutlaysManagerWebClient/OutlaysManagerWebClient.csproj", "OutlaysManagerWebClient/"]
RUN dotnet restore "OutlaysManagerWebClient/OutlaysManagerWebClient.csproj"
COPY . .

WORKDIR "/src/OutlaysManagerWebClient/clientAngular"
RUN npm install
RUN ng build --configuration production

WORKDIR "/src/OutlaysManagerWebClient"
RUN dotnet build "OutlaysManagerWebClient.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OutlaysManagerWebClient.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OutlaysManagerWebClient.dll"]